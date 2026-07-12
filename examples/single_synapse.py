"""Single-synapse kT-RAM emulator example.

This follows the basic setup from Alex Nugent's "The Neural Lane Emulator":
one lane, one address space, one differential pair selected by AAT ``(0,)``.
"""

from __future__ import annotations

from statistics import mean

from ktram_neural_core import Core


def describe(core: Core, z: tuple[int, ...], label: str) -> float:
    """Read and print the current single-synapse state."""
    y = core.evaluate(z, "FF", noise=0.0)
    ga, gb = core.read_gab(0, z)
    magnitude = ga + gb
    print(f"{label:>18}: y={y:+.6f}  Ga={ga:.6g}  Gb={gb:.6g}  m={magnitude:.6g}")
    return y


def main() -> None:
    z = (0,)

    # Disable read noise for the first section so repeated runs are easy to compare.
    core = Core(
        1,
        1,
        spaces_per_lane=1,
        num_lanes=1,
        model="float",
        init="medium",
        seed=1,
        read_noise=0.0,
    )

    print("Clean single-synapse read")
    describe(core, z, "initial")

    print("\nSupervised upward feedback cycle: read with FF, then reinforce with RH")
    for step in range(1, 6):
        core.evaluate(z, "FF")
        core.evaluate(z, "RH")
        describe(core, z, f"step {step}")

    print("\nSub-threshold noisy reads sample the stored weight")
    noisy = Core(
        1,
        1,
        spaces_per_lane=1,
        num_lanes=1,
        model="float",
        init="medium",
        seed=7,
        read_noise=0.02,
    )
    noisy.set_start_y(0, z, y0=0.0)

    samples = [noisy.evaluate(z, "FFLV", noise=0.0) for _ in range(20)]
    positives = sum(1 for y in samples if y >= 0.0)

    print(f"sample mean={mean(samples):+.6f}")
    print(f"positive samples={positives}/{len(samples)}")
    print("first samples:", " ".join(f"{y:+.4f}" for y in samples[:8]))


if __name__ == "__main__":
    main()
